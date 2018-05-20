//data 和 储存 元素的二维数组一一对应
const Game = function(){
	//盒子Box
	let gameBox;
	let nextBox;
	//地图矩阵
	let gameMap =[
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,2,0,0,0,0,0],
				[0,2,2,2,2,2,2,2,0,0]
			]
	let nextMap=[
		[0,1,0,0],
		[0,1,0,0],
		[0,1,1,0],
		[0,0,0,0]
	]
	//当前方块
	let cur;	
	//下一个方块
	let next;
	//储存的元素
	let gameDivs =[];
	let nextDivs = [];
	//初始化 Box ，将储存的元素与游戏矩阵同步
	function initDiv(container,data,divs){
		for(let i=0;i<data.length;i++){
			var Div = []
			for(let j=0;j<data[0].length;j++){
				let el = document.createElement('div');
				el.className = 'none';
				el.style.top = (20*i) +'px';
				el.style.left = (20*j) + 'px';
				container.appendChild(el);
				Div.push(el)
			}
			divs.push(Div);
		}
	}
	//刷新
	function refreshDiv(data,divs){
		for(let i=0;i<data.length;i++){
			for(let j=0;j<data[0].length;j++){
				switch(data[i][j]){
					case 0:
						divs[i][j].className='none';
						break;
					case 1:
						divs[i][j].className='current';
						break;
					case 2:
						divs[i][j].className='done';
						break;
					default:
						break;
				}			
			}
		}
	}
	//检查方块是否合法
	function check(pos,x,y){//cur.origin   i j 遍历小方块
		if(pos.y + x <0){
			console.log(1)
			return false;
		}else if(pos.y + x >= gameMap.length){
			console.log(2)
			return false;
		}else if(pos.x + y < 0){
			console.log(3)
			return false;
		}else if(pos.x + y >= gameMap[0].length){
			console.log(4)
			return false;
		}else if(gameMap[pos.y+x][pos.x+y] ==2){
			console.log(5)//是否已经有灰色块
			return false
		}else{
			console.log(6)
			return true
		}
	}
	//检测数据是否合法
	let isValid = function (pos,data){
		for(let i=0;i<data.length;i++){
			for(let j=0;j<data[0].length;j++){
				if(data[i][j] != 0){
					if(!check(pos,i,j)){
						return false
					}
				}
			}
		}
		return true
	}
	
	//拷贝next to Box
	function copy(nextMap,gameMap,origin){
		for(let i = 0 ;i<nextMap.length;i++){
			for(let j =0;j<nextMap[0].length;j++){
				if(nextMap[i][j] == 1){
					if(check(origin,i,j)){
						gameMap[origin.y+i][origin.x+j]=nextMap[i][j];
					}
				}
			}
		}
		refreshDiv(gameMap,gameDivs)
	}
	//清除上一次移动
	function clear(nextMap,gameMap,origin){
		for(let i = 0 ;i<nextMap.length;i++){
			for(let j =0;j<nextMap[0].length;j++){
				if(nextMap[i][j] == 1){
					if(check(origin,i,j)){
						gameMap[origin.y+i][origin.x+j]=0;
					}
				}
			}
		}
		refreshDiv(gameMap,gameDivs)
	}
	function down(){	
		if(cur.canDown(isValid)){
			clear(cur.data,gameMap,cur.origin)	
			cur.down();	
			copy(cur.data,gameMap,cur.origin)
			return true;
		}else{
			return false;
		}
	}
	function left(){	
		if(cur.canLeft(isValid)){
			clear(cur.data,gameMap,cur.origin)
			cur.left();
			copy(cur.data,gameMap,cur.origin)
		}
			
	}
	function right(){	
		if(cur.canRight(isValid)){
			clear(cur.data,gameMap,cur.origin)
			cur.right();
			copy(cur.data,gameMap,cur.origin)
		}
	}
	function rotate(){	
		if(cur.canRotate(isValid)){
			clear(cur.data,gameMap,cur.origin)
			cur.rotate();
			copy(cur.data,gameMap,cur.origin)
		}
	}
	//掉落定型
	let fixed = function(){
		for(let i = 0 ;i<cur.data.length;i++){
			for(let j =0 ; j<cur.data[0].length;j++){
				if(check(cur.origin,i,j)){
					if(gameMap[cur.origin.y+i][cur.origin.x+j]==1){
						gameMap[cur.origin.y+i][cur.origin.x+j]=2
					}
				}
			}
		}
		refreshDiv(gameMap,gameDivs)
	}
	//消行
	function checkClear(){
		for(let i = gameMap.length - 1;i >= 0;i--){
			var clear =true;
			for(let j = 0 ;j<gameMap[0].length;j++){
				if(gameMap[i][j] != 2){
					clear = false ;
					break;
				}
			}
			if(clear){
				for(let m = i;m>0 ; m--){
					for(let n = 0;n<gameMap[0].length;n++){
						gameMap[m][n]=gameMap[m-1][n]
					}
				}
				for(let n = 0;n<gameMap[0].length;n++){
						gameMap[0][n]=0
				}
				i++;
			}
		}
	}
	//检查游戏结束
	function checkGameOver(){
		let gameOver = false ;
		for(let i = 0; i<gameMap[0].length;i++){
			if(gameMap[1][i] == 2){
				gameOver = true
			}
		}
		return gameOver;
	}
	//产生新的方块
	function performNext(type,dir){
		cur = next
//		setData();
		next = new SquareFactory.prototype.make(type,dir)
		refreshDiv(gameMap,gameDivs)
		refreshDiv(next.data,nextDivs)
	}
	//初始化
	function init(doms){
		gameBox = doms.gameBox;
		nextBox = doms.nextBox;
		cur = SquareFactory.prototype.make(2,3)
		next = SquareFactory.prototype.make(3,3)

		initDiv(gameBox,gameMap,gameDivs)
		initDiv(nextBox,next.data,nextDivs)
		refreshDiv(gameMap,gameDivs)
		refreshDiv(next.data,nextDivs)
		copy(cur.data,gameMap,cur.origin)
	}
	//导出API
	this.init = init;
	this.down = down;
	this.left = left;
	this.right = right;
	this.rotate = rotate;
	this.fixed = fixed;
	this.performNext = performNext;
	this.checkClear = checkClear;
	this.checkGameOver =checkGameOver;
	this.fall =function(){
		while(down());
	}
}