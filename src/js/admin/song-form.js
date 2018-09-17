{
    let view = {
        el: '.page > main',
        template: `
            <h1>新建歌曲</h1>
            <form class="form">    
                <div class="row">
                    <label>
                        <span>歌曲</span><input type="text" name="name" value="{name}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>歌手</span><input name="singer" type="text" value="{singer}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>外链</span><input type="text" name="url" value="{url}">
                    </label>
                </div>
                <div class="row">
                    <label>
                        <span>封面</span><input type="text" name="cover" value="{cover}">
                    </label>
                </div>
                <div class="row">
                    <button type="submit">保存</button>
                </div>
            </form>
        `,
        render(data = {}){
            // 渲染页面3件事：
            // 首先明确要更新哪些占位符，将它们放入一个数组中，方便遍历
            // 其次创建新模板，不断用新数据来更新这个模板
            // 最后将新的模板渲染进页面
            let placeholder = ['name', 'url', 'singer', 'id', 'cover']
            let newTemplate = this.template
            placeholder.map((item)=>{
                newTemplate = newTemplate.replace(`{${item}}`, data[item] || '')
            })
            document.querySelector(this.el).innerHTML = newTemplate
            if(!data.id){
                document.querySelector(`${this.el} h1`).innerText = '新建歌曲'
            }else{
                document.querySelector(`${this.el} h1`).innerText = '编辑歌曲'
            }
        },
        reset(){
            this.render()
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: '',
            cover: ''
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);
            song.set('cover',data.cover);
            return song.save().then(
                (newSong)=>{
                    let {id, attributes} = newSong
                    // 此处没有声明新的对象，只是将原对象中的数据进行更改，但是往外传的时候要复制一下
                    Object.assign(this.data, {
            // id:id, name: attributes.name, singer: attributes.singer, url: attributes.url
                        id,
                        ...attributes
                    })
                },
                (error)=>{console.log(error)}
            )
        },
        update(data){
            let song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            return song.save().then((response)=>{
                Object.assign(this.data, response.attributes)
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHubs()
        },
        bindEvents(){
            // 五件事：拿表单数据、提交表单数据、更新model数据、渲染页面(此处为清空)、触发一个事件
            $(this.view.el).on('submit', 'form', (ev)=>{
                ev.preventDefault()
                if(this.model.data.id){
                    // console.log('id存在，是已经展示的数据，是数据库存在的数据')
                    this.update()
                }else{
                    // console.log('id不存在，是正在新建的数据')
                    this.create()
                }
            })
        },
        bindEventHubs(){
            window.eventHub.listen('select', (data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.listen('new', (data)=>{
                if(this.model.data.id){
                    this.model.data = {name: '',singer: '',url: '',id: ''}
                }else{
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = ['name', 'singer', 'url', 'cover']
            let data = {}
            needs.map((item)=>{
                data[item] = document.querySelector(`input[name=${item}]`).value
            })
            this.model.create(data).then(
                ()=>{
                    this.view.reset()
                    window.eventHub.trigger('create', JSON.parse(JSON.stringify(this.model.data)))  
                }
            )
        },
        update(){
            let needs = ['name', 'singer', 'url', 'cover']
            let data = {}
            needs.map((item)=>{
                data[item] = document.querySelector(`input[name=${item}]`).value
            })
            this.model.update(data).then(()=>{
                window.eventHub.trigger('update', JSON.parse(JSON.stringify(this.model.data)))
            })
        }
    }

    controller.init.call(controller, view, model)
}