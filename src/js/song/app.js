// 从浏览器查询参数中获得id，然后通过该id在数据库中找到那条数据，然后下载下来保存在model的data里
// 页面中写入audio标签，添加播放和暂停按钮及操作  


{
    let view = {
        el: '#app',
        render(data){
            let {song} = data
            // 背景图片和中间转圈的图片 都来自于数据库，即model中数据
            document.querySelector(this.el).style.cssText = `background-image: url(${song.cover})`
            document.querySelector(this.el).querySelector('img.cover').setAttribute('src', song.cover)
            // 歌曲没变，就不要重新载入，防止歌曲从头开始播放
            if(document.querySelector(this.el).querySelector('audio').getAttribute('src') !== song.url){
                document.querySelector(this.el).querySelector('audio').setAttribute('src', song.url)
            }
            // 查看model中状态，如果是播放，就添加playing类，开始转圈，否则去掉playing类
            if(data.status === 'playing'){
                document.querySelector(`${this.el} .disc-container`).classList.add('playing')
            }else{
                document.querySelector(`${this.el} .disc-container`).classList.remove('playing')
            }
        },
        play(){
            document.querySelector(this.el).querySelector('audio').play()
        },
        pause(){
            document.querySelector(this.el).querySelector('audio').pause()
        }
    }
    let model = {
        data: {
            song:{
                id: '',
                name: '',
                singer: '',
                url: '',
                cover: 'pause'
            },
            status: 'paused'    //播放状态，此信息不放在数据库，故而和上面的分开放
        },
        fetch(id){
            let query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data.song, song.attributes)
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.fetch(id).then(()=>{
                this.view.render(this.model.data)
                // this.view.play()
            })
            this.bindEvents()
        },
        bindEvents(){
            document.querySelector(`${this.view.el} .icon-play`).addEventListener('click', ()=>{
                // 该状态、加载页面动画、播放音乐
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            document.querySelector(`${this.view.el} .icon-pause`).addEventListener('click', ()=>{
                // 该状态、加载页面动画、播放音乐
                this.model.data.status = 'pause'
                this.view.render(this.model.data)
                this.view.pause()
            })
        },
        getSongId(){
            let search = window.location.search //例如：?xx=100 & yy=200
            if(search.indexOf('?') !== -1){
                search = search.substring(1)    //除去第一个问号
            }
            let id = ''
            let array = search.split('&').filter((v=>v))    //加filter过滤空的字符串，真值要 假值不要
            array.map((item)=>{
                let obj = item.split('=')
                if(obj[0] === 'id'){
                    id = obj[1]
                }
            })
            return id
        }
    }

    controller.init(view, model)
}