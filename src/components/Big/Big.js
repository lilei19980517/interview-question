import React from 'react'
import './Big.css'
import Card from '../../components/Card/Card'

class Big extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isUseNum: 0,//已使用次数
            isOkNum: 0,//已成功多少对
        }
    }
    // 传入方法给子组件让子组件修改父组件state
    changeState = (isUseNum,isOkNum) => {
        this.setState( { isUseNum: isUseNum, isOkNum: isOkNum } )
        if(isOkNum === 6){
            setTimeout(()=>alert('恭喜你胜利了'),1000)
        }
    }
    //接收子组件this
    useChildFn = (ref) => {
        this.child = ref
    }
    // 洗牌
    clickFn = () => { this.child.daLuanArray() }
    render(){
        return(
            <div className='Big'>
                <Card 
                    changeBigState={
                        (isUseNum,isOkNum)=>{this.changeState(isUseNum,isOkNum)}
                    }
                    giveFatherThis={
                        (e) => {this.useChildFn(e)}
                    }
                >
                </Card>
                <button 
                    className='big-btn' 
                    onClick={this.clickFn}
                >
                    重新开始
                </button>
                <div>已用次数{ this.state.isUseNum }</div>
                <div>已成功{ this.state.isOkNum }对</div>
            </div>
        )
    }
}
export default Big