import React from 'react'
import './Card.css'
// 图片素材
import img1 from '../../images/1.png'
import img2 from '../../images/2.png'
import img3 from '../../images/3.png'
import img4 from '../../images/4.png'
import img5 from '../../images/5.png'
import img6 from '../../images/6.png'

class Card extends React.Component {
    static defaultProps = {
        data: [
            { id: 0, key: 1, imgUrl: img1 },
            { id: 1, key: 2, imgUrl: img2 },
            { id: 2, key: 3, imgUrl: img3 },
            { id: 3, key: 4, imgUrl: img4 },
            { id: 4, key: 5, imgUrl: img5 },
            { id: 5, key: 6, imgUrl: img6 },
            { id: 6, key: 1, imgUrl: img1 },
            { id: 7, key: 2, imgUrl: img2 },
            { id: 8, key: 3, imgUrl: img3 },
            { id: 9, key: 4, imgUrl: img4 },
            { id: 10, key: 5, imgUrl: img5 },
            { id: 11, key: 6, imgUrl: img6 },
        ]
    }

    constructor(props) {
        super(props)
        // 把this传父组件
        this.props.giveFatherThis(this)
        this.state = {
            newData: [],//用来接收复制并合并后的数组,
            key: null,//用来判断是否和上一张牌图形相同
            num: null,//用来记牌防止重复点击还触发翻牌效果
            nums: [],//记住已经成功的牌
            isUseNum: 0,//记录已点击次数
        }
    }

    UNSAFE_componentWillMount() {
        // 每张卡片应该有两张。将数组复制后合并
        const { data } = this.props
        const that = this
        let p = new Promise( function(resolve, reject){
            // that.setState( { newData: [ ...data, ...data ] } )
            // 给每一项加上isTurnOver代表翻牌的状态
            data.forEach(item=>{item.isTurnOver = false})
            that.setState( { newData: data } )
            resolve()
        })
        // 执行一下打乱
        p.then((resolve) => this.daLuanArray() )
    }
    //初始化
    restFn = () => {this.setState({
        key: null,
        num: null,
        nums: [],
        isUseNum: 0
    })}    //将卡片数组打乱的方法(洗牌)
    daLuanArray() {
        this.setState(
            { newData: this.state.newData.sort( ()=> 0.5 - Math.random() ) }
        )
        // 洗完之后还要初始化
        this.restFn()
        this.state.newData.forEach(item => {
            item.isTurnOver = false
            item.isOk = false
        })
        // 父组件也要归零
        this.props.changeBigState(0,0)
    }
    // 翻牌
    turnOver(num) {
        let arr = this.state.newData
        // 进来先判断这张牌是不是已经点过或者是已经成功的牌
        if( !(num === this.state.num || this.state.nums.includes(num))){
            // 将这张牌记下来
            this.setState( { num: num } )
            // arr.forEach(item=>item.isTurnOver = false)
            if( arr[num].key === this.state.key ){
                // 如果两张牌一样
                //将这两张牌记下来
                //num是这一次牌，this.state.num是上一次的牌
                let nums = [ ...this.state.nums, this.state.num, num ]
                this.setState( { nums: nums } )
                //并且添加类名
                let addClassArr = arr.filter(item => item.key === arr[num].key )
                addClassArr.forEach( item => item.isOk = true )
                Object.assign({},arr,addClassArr)
                // 异步原因手动+1
                this.props.changeBigState( this.state.isUseNum + 1, this.state.nums.length/2 +1 )
                this.setState({ isUseNum: this.state.isUseNum +1 })

            }else {
                // 不是同一张牌就把上一张牌盖住
                // 不能盖住已经成功的牌
                arr.forEach((item,key) =>{
                    if(!this.state.nums.includes(key)){
                        item.isTurnOver = false
                    }
                })
                // 次数加一
                this.setState({ isUseNum: this.state.isUseNum + 1 })
                this.props.changeBigState( this.state.isUseNum + 1, this.state.nums.length/2 )
                this.setState({num: num})
                //记下这张牌的key用作下次判断是否图案相同
                this.setState( { key: arr[num].key } )
                // setState的异步原因设置后无法立即获取，直接手动+1
            }
            arr[num].isTurnOver = true
            this.setState( { newData: arr })
        }
    }
    render() {
        return (
            <div className='Card'>
                {
                    this.state.newData.map((item,key) =>
                    <div 
                        className={ 
                            `card-item ${item.isTurnOver 
                            ? 'card-item-act ' : ' '}${item.isOk 
                            ? 'card-item-ok' : ' '}` 
                        }
                        key={ item.id }
                        onClick={ () => this.turnOver(key) }
                    >
                        {/* 牌的背面 */}
                        {!item.isOk && <div className='card-item-back'></div>}
                        {/* 牌的正面 */}
                        <img 
                            // css里面设置了翻转动画，每次渲染都会重复
                            // 如果成功的牌就换个类名解决这个bug
                            // 最后一张不能算进去因为是刚点击的不能没有效果
                            className={
                                `${ item.isOk && this.state.num !== key 
                                ? 'card-item-img-ok'
                                :'card-item-img'}`
                            }
                            src={item.imgUrl}
                            alt="卡片"
                            key={ Math.random() }
                        />
                    </div>)
                }
            </div>
        )
    }
}
export default Card