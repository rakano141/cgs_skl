const BLOCK_WIDTH = 10;
const BLOCK_HEIGHT = 15;
const INTERVAL_PIXEL = 1;
const d = document;

d.addEventListener("DOMContentLoaded", (event)=>{
	console.log("Last Update	:11/27 12:26");
	let MUSIC_TIME = 130;
	let LIVETYPE = "";
	let MARGINCONTENTS = 0;
	const canvas = d.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = 8000;
	canvas.height = 2000;
	ctx.scale(2,2);
	let skills = [];
	//----------------
	d.getElementById("liveType").addEventListener("change", function(cev){
		if(confirm("設定スキルはリセットされます")){
			changeLiveType(this.value);
		}
	},false);
	d.getElementById("musicLength").addEventListener("change", function(cev){
		console.log(this.value);
		MUSIC_TIME = Number(this.value);
		draw();
	},false);
	d.getElementById("addSkill").addEventListener("click", function(cev){
		let tmp = {};
		let unitDocs = "";
		let skillListDisplayName = [];
		switch(d.getElementById("skillList_name").value){
			case "sk_name_boost" :
				tmp.cl = "boost";
				skillListDisplayName[0] = "スキルブースト";
				break;
			case "sk_name_synergy" :
				tmp.cl = "synergy";
				skillListDisplayName[0] = "トリコロールシナジー";
				break;
			case "sk_name_prfcteSpt" :
				tmp.cl = "prfcteSpt";
				skillListDisplayName[0] = "パーフェクトサポート";
				break;
			case "sk_name_dmgGrd" :
				tmp.cl = "dmgGrd";
				skillListDisplayName[0] = "ダメージガード";
				break;
			default :
				alert("スキル名を選択してください");
				return false;
		} //スキル名設定
		tmp.it = Number(d.getElementById("skillList_inTime").value);
		switch(d.getElementById("skillList_acTime").value){
			case "sk_acTime_3" :
				tmp.ht = 3;
				skillListDisplayName[1] = "一瞬(3秒)";
				break;
			case "sk_acTime_4_5" :
				tmp.ht = 4.5;
				skillListDisplayName[1] = "わずか(4.5秒)";
				break;
			case "sk_acTime_6" :
				tmp.ht = 6;
				skillListDisplayName[1] = "少し(6秒)";
				break;
			case "sk_acTime_7_5" :
				tmp.ht = 7.5;
				skillListDisplayName[1] = "しばらく(7.5秒)";
				break;
			case "sk_acTime_9" :
				tmp.ht = 9;
				skillListDisplayName[1] = "かなり(9秒)";
				break;
			default :
				alert("発動時間を選択してください");
				return false;
		} //発動時間設定
		if(LIVETYPE == "GRAND"){
			switch(d.getElementById("skillList_unit").value){
				case "sk_unit_A" :
					tmp.gr = 1;
					skillListDisplayName[2] = "A";
					break;
				case "sk_unit_B" :
					tmp.gr = 2;
					skillListDisplayName[2] = "B";
					break;
				case "sk_unit_C" :
					tmp.gr = 3;
					skillListDisplayName[2] = "C";
					break;
				default :
					alert("ユニットを選択してください");
					return false;
			}
			unitDocs = `<td>${skillListDisplayName[2]}<\/td>`;
		} //ユニット設定
		d.getElementById("skillTableBody").innerHTML +=
		`<tr class="skillTable_lists">
			<td>${skillListDisplayName[0]}<\/td>
			<td>${d.getElementById("skillList_inTime").value}秒<\/td>
			<td>${skillListDisplayName[1]}<\/td>
			${unitDocs}
			<td><input class="skillTable_remove" type="button" value="ー" /><\/td>
		</tr>`;
		skills.push(tmp);
		setSkillTableRemover();
		draw();
	},false);
	//----------------
	const setSkillTableRemover = ()=>{
		for(let i = 0;i < d.getElementsByClassName("skillTable_remove").length;i++){
			d.getElementsByClassName("skillTable_remove")[i].onclick = ()=>{
				d.getElementsByClassName("skillTable_lists")[i].parentNode.removeChild(d.getElementsByClassName("skillTable_lists")[i]);
				skills.splice(i, 1);
				draw();
				setSkillTableRemover();
			};
		}
	}
	const draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		let ontentMargin = 0;
		for(let t = 0;t <= MUSIC_TIME;t++){
			if(t%10==0){
				ctx.fillStyle = "black";
			}else{
				ctx.fillStyle = "dimgray";
			}
			ctx.fillRect(t*BLOCK_WIDTH, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
			ctx.font = "10px sans-serif";
			ctx.fillStyle = "white";
			ctx.fillText(t%10, (t+0.2)*BLOCK_WIDTH, (0.8)*BLOCK_HEIGHT);
		}//ヘッド
		ontentMargin++;
		let prfcteSpt = [];
		let boost = [];
		let dmgGrd = [];
		for(let i = 0;i < skills.length;i++){
			for(let t = 0, grandc = 0, gr = (skills[i].gr)?skills[i].gr:0;t <= MUSIC_TIME;t++){
				let count = Math.floor(t/skills[i].it);
				if((count!=0)&&(count*skills[i].it<=t)&&(t<count*skills[i].it+skills[i].ht)){
					if(t%skills[i].it==0)grandc++;
					if(((grandc-1)%3)==(gr-1)||LIVETYPE=="WIDE"){
						switch(skills[i].cl){
							case "boost":
								ctx.fillStyle = "yellow";
								codeToSklAry(boost, t, count*skills[i].it+skills[i].ht-t);
								break;
							case "prfcteSpt":
								ctx.fillStyle = "lime";
								codeToSklAry(prfcteSpt, t, count*skills[i].it+skills[i].ht-t);
								break;
							case "dmgGrd":
								ctx.fillStyle = "cyan";
								codeToSklAry(dmgGrd, t, count*skills[i].it+skills[i].ht-t);
								break;
							case "synergy":
								ctx.fillStyle = "pink";
								break;
							default:
								ctx.fillStyle = "darkgray";
						}

					}else{
						ctx.fillStyle = "darkgray";
					}
					if((count*skills[i].it+skills[i].ht-t)==0.5){
						ctx.fillRect(t*BLOCK_WIDTH,(i+ontentMargin)*BLOCK_HEIGHT, BLOCK_WIDTH/2, BLOCK_HEIGHT);
						ctx.strokeRect(t*BLOCK_WIDTH,(i+ontentMargin)*BLOCK_HEIGHT, BLOCK_WIDTH/2, BLOCK_HEIGHT);
					}else{
						ctx.fillRect(t*BLOCK_WIDTH,(i+ontentMargin)*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
					}
				}else{
					//tx.fillStyle = "black";
				}
				ctx.strokeRect(t*BLOCK_WIDTH,(i+ontentMargin)*BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
		}
		arrayDraw(boost, ontentMargin, "gold", "display_boost");
		ontentMargin++;
		arrayDraw(prfcteSpt, ontentMargin, "green", "display_pftsp");
		ontentMargin++;
		arrayDraw(dmgGrd, ontentMargin, "blue");
		ontentMargin++;
		let tmpAry = [];
		for(let t = 0;t <= MUSIC_TIME;t++){
			if(boost[t]==1&&prfcteSpt[t]==1){
				tmpAry[t] = 1;
			}else if((boost[t]==0.5&&prfcteSpt[t]==1)||(boost[t]==1&&prfcteSpt[t]==0.5)){
				tmpAry[t] = 0.5;
			}else{
				tmpAry[t] = 0;
			}
		}
		arrayDraw(tmpAry, ontentMargin, "gold", "display_pefec");
		ontentMargin++;
		for(let t = 0;t <= MUSIC_TIME;t++){
			if(dmgGrd[t]==1||tmpAry[t]==1){
				tmpAry[t] = 1;
			}else if(dmgGrd[t]==0.5||tmpAry[t]==0.5){
				tmpAry[t] = 0.5;
			}else{
				tmpAry[t] = 0;
			}
		}
		arrayDraw(tmpAry, ontentMargin, "skyblue");
		ontentMargin++;
	};
	const arrayDraw = (ary, margin, color = "lightgreen", displayId)=>{
		let totalSec = 0;
		let height = (skills.length+margin)*BLOCK_HEIGHT+INTERVAL_PIXEL;
		for(let t = 0;t <= MUSIC_TIME;t++){
			if(ary[t]){
				//console.log("ary["+t+"]:\t"+ary[t]);
				totalSec += ary[t];
				ctx.fillStyle = color;
				if(ary[t]==0.5){
					ctx.fillRect(t*BLOCK_WIDTH, height, BLOCK_WIDTH/2, BLOCK_HEIGHT);
					ctx.fillStyle = "lightgray";
					ctx.fillRect((t+0.5)*BLOCK_WIDTH, height, BLOCK_WIDTH/2, BLOCK_HEIGHT);
					ctx.strokeRect(t*BLOCK_WIDTH, height, BLOCK_WIDTH/2, BLOCK_HEIGHT);
				}else{
					ctx.fillRect(t*BLOCK_WIDTH, height, BLOCK_WIDTH, BLOCK_HEIGHT);
				}
			}else{
				ctx.fillStyle = "lightgray";
				ctx.fillRect(t*BLOCK_WIDTH, height, BLOCK_WIDTH, BLOCK_HEIGHT);
			}
			ctx.strokeRect(t*BLOCK_WIDTH, height, BLOCK_WIDTH, BLOCK_HEIGHT);
		}
		console.log("TotalSec:\t"+totalSec);
		console.log(displayId);
		if(displayId)d.getElementById(displayId).value = totalSec;	
	};
	const changeLiveType = (type)=>{
		console.log(type);
		let elements;
		switch(type){
			case "wide":
				LIVETYPE = "WIDE";
				d.getElementById("skillList_unit").style.display = "none";
				d.getElementById("grand_unit").style.display = "none";
				break;
			case "grand":
				LIVETYPE = "GRAND";
				d.getElementById("skillList_unit").style.display = "inline";
				d.getElementById("grand_unit").style.display = "table-cell";
				break;
			default:
				throw new Error("ライブタイプエラー");
				return false;
		}
		elements = d.getElementsByClassName("skillTable_lists");
		for(let i = elements.length; i > 0; i--){
			elements[i-1].parentNode.removeChild(elements[i-1]);
		}
		skills = [];
		draw();
	}
	const codeToSklAry = (ary, num, val)=>{
		if(ary[num] != 1){
			if(val == 0.5){
				ary[num] = 0.5;
			}else{
				ary[num] = 1;
			}
		}
	}
	//----------------
	changeLiveType("grand");
	draw();
}, false);
//----------------
const isNumber = function(value) {
  return ((typeof value === 'number') && (isFinite(value)));
};
