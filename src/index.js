let colors=require("./color"),
    readline=require("readline"),
    http=require("http");
const API_KEY='d6aa6d6211264834b7e2edda507549d3';
function initChat(){
	let welcomeMsg="请开始你的表演";
	// for(let i=0;i<welcomeMsg.length;i++){
	// 	colors.colorLog("--------------",welcomeMsg[i],"-------------");	
	// }
	Array.prototype.forEach.call(welcomeMsg,(it)=>{
        colors.colorLog("--------------",it,"--------------");
    })
    // welcomeMsg.split("").forEach(
    // 	colors.colorLog("this");
    // )


	const rl=readline.createInterface({
		input:process.stdin,
		output:process.stdout
	});
	let name="";
	rl.question(">阁下尊姓大名：",  (answer)=>{
		name=answer;
		colors.colorLog("客官请提问！");
		chat();
	});

	function chat(){
		rl.question('>请输入你的问题：', (query)=>{
			if(!query){
				colors.colorLog("客官请慢走");
				process.exit(0);
			}
			let req=http.request({
				hostname:'www.tuling123.com',
				path:'/openapi/api',
				method:'POST',
				headers:{
					'Content-Type':'application/json'
				}
			}, (res)=>{
				let data='';
				res.on('data',(chunk)=>{
					data+=chunk;
				});
				res.on('end', ()=>{
					colors.colorLog(handleResponse(data));
					chat();
				})
			});
			req.write(JSON.stringify({
				key: API_KEY,
			    info: query,
			    userid: name
			}));
			req.end();
		});
	}
	function handleResponse(data){
		var res=JSON.parse(data);
		switch(res.code){
			case 100000:
			     return res.text;
			case 200000:
			    return `${res.text}:${res.url}`; 
			case 302000:
			    let listInfo="";
			    (res.list||[]).forEach((it) =>{
			    	listInfo+=`文章：${it.article}\n来源：${it.source}\n链接：${it.detailurl}`;
			    })
			    return `${res.text}\n${listInfo}`;   
			default:
			    return res.text;        
		}
	}
};
	
module.exports=initChat;