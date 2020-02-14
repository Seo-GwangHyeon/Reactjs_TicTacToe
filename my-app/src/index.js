import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const col =20;
const row =20;
function Square(props) { // 컴포넌트는 항상 대문자로 시작해야한다 ! 아니면 tag로 인식을 해버린다.
    //controlled components. 
    return (// 버튼의 value를 보여지는 값으로 설정
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component{
    renderSquare(i)
    {//Square의 value를 전달
        return (
        <Square value={this.props.squares[i] }
        onClick={() => this.props.onClick(i)}// handle클릭은 임의로 붙인 이름
        />
        );
    }

    render(){

        let table = []
       
        // Outer loop to create parent
        for (let i = 0; i < row; i++) 
        {
          let children = []
          for (let j = 0; j < col; j++) 
          {
                children.push(this.renderSquare(i*col+j))
          }
          table.push(<div className="board-row">{children}</div>)
        }
        return (
            <div>
                {table}
            </div>
        );
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            history:[{
                squares: Array(col*row).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber +1 );
        const current =history[history.length -1 ];
        const squares = current.squares.slice();//배열의 사본을 만든다.
        /* 이유 ㅣ
            - history를 알 수 있어, 복잡한 특징들을 단순하게 구현할 수 있게한다( 시간여행)
            - 변화를 감지하여 기존 객체와 비교하여 변화를 감지할 수 있다.
            - 렌더링 시기를 결정할 수 있다.
        */
        if (calculateWinner(squares) || squares[i])
        {
            return;
        }

        squares[i]=this.state.xIsNext? 'X' : 'O';
        //squares[i]=i;
        
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }


    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ===0,
        })
    }

    render(){
        const history = this.state.history;
        const current =history[this.state.stepNumber];
        const winner =calculateWinner(current.squares, this.state.xIsNext);
        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move +' - ' + this.state.stepNumber/col + '  '+this.state.stepNumber%col :
            'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner){
            status='Winner : '+winner;
        }
        else
        {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            // JSX 문법
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={ (i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')// element를 root DOM노드에 렌더링
);

function calculateWinner(squares, next) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    /*
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }*/
    var player = next? 'O' : 'X';
    
    console.log(player+'__');

    for( let i =0; i<row-4;++i)
    {
        for( let j=0;j<col;++j)
        {
            if(squares[i*col+j] ===player && squares[(i+1)*col+j] ===player  && squares[(i+2)*col+j] ===player  
            && squares[(i+3)*col+j] ===player && squares[(i+4)*col+j] ===player )
            {
                console.log('somebody win ');
                return player;
            }
        }
    }

    for( let i =0; i<row;++i)
    {
        for( let j=0;j<col-4;++j)
        {
            if(squares[i*col+j] ===player && squares[i*col+j+1] ===player  && squares[i*col+j+2] ===player  
            && squares[i*col+j+3] ===player && squares[i*col+j+4] ===player )
            {
                console.log('somebody win ');
                return player;
            }
        }
    }

    for( let i =0; i<row-4;++i)
    {
        for( let j=0;j<col-4;++j)
        {
            if(squares[i*col+j] ===player && squares[(i+1)*col+j+1] ===player  && squares[(i+2)*col+j+2] ===player  
            && squares[(i+3)*col+j+3] ===player && squares[(i+4)*col+j+4] ===player )
            {
                console.log('somebody win ');
                return player;
            }
        }
    }

    for( let i =0; i<row-4;++i)
    {
        for( let j=0;j<col-4;++j)
        {
            if(squares[(row-i-1)*col+j] ===player && squares[(row-i-2)*col+j+1] ===player  && squares[(row-i-3)*col+j+2] ===player  
            && squares[(row-i-4)*col+j+3] ===player && squares[(row-i-5)*col+j+4] ===player )
            {
                console.log('somebody win ');
                return player;
            }
        }
    }




    return null;
  }
