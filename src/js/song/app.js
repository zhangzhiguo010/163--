// 从浏览器查询参数中获得id，然后通过该id在数据库中找到那条数据，然后下载下来保存在model的data里
// 页面中写入audio标签，添加播放和暂停按钮及操作
{
    let view = {
        el: '#app',
        template: `
            <audio src={url}></audio>
            <div>
                <button class="play">播放</button>
                <button class="pause">暂停</button>
            </div>
        `,
        render(data){
            this.template = this.template.replace('{url}', data.url)
            document.querySelector(this.el).innerHTML = this.template
        },
        play(){
            let audio = document.querySelector(`${this.el} audio`)
            audio.play()
        },
        pause(){
            let audio = document.querySelector(`${this.el} audio`)
            audio.pause()
        }

    }
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: ''
        },
        fetch(id){
            let query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data, song.attributes)
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
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click', '.play', ()=>{
                this.view.play()
            })
            $(this.view.el).on('click', '.pause', ()=>{
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