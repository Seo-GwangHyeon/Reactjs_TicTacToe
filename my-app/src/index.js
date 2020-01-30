import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    //controlled components. 
    return (// 버튼의 value를 보여지는 값으로 설정
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component{
    /*
    constructor(props)
    {
        super(props);//하위 클래스의 생성자를 정의할 때 항상 super를 호출 해야한다. 
        // 상위 클래스의 생성자를 사용하는 것? 
        this.state ={
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
    */
    

    renderSquare(i)
    {//Square의 value를 전달
        return (
        <Square value={this.props.squares[i] }
        onClick={() => this.props.onClick(i)}// handle클릭은 임의로 붙인 이름
        />
        );
    }

    render(){
        /*
        const winner = calculateWinner(this.state.squares);

        let status;
        if (winner){
            status='Winner : '+winner;
        }
        else
        {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        */

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            history:[{
                squares: Array(9).fill(null),
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
        const winner =calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move:
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
    document.getElementById('root')
);

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }