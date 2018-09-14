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
                    <button type="submit">保存</button>
                </div>
            </form>
        `,
        render(data = {}){
            // 渲染页面3件事：
            // 首先明确要更新哪些占位符，将它们放入一个数组中，方便遍历
            // 其次创建新模板，不断用新数据来更新这个模板
            // 最后将新的模板渲染进页面
            let placeholder = ['name', 'url', 'singer', 'id']
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
            id: ''
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name',data.name);
            song.set('singer',data.singer);
            song.set('url',data.url);
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
                let needs = ['name', 'singer', 'url']
                let data = {}
                needs.map((item)=>{
                    data[item] = document.querySelector(`input[name=${item}]`).value
                })

                this.model.create(data).then(
                    ()=>{
                        this.view.reset()
                        // 深拷贝，以前一直传的是同一个引用地址，现在每次传的都是新的地址
                        // 不深拷贝，一个模块更改了数据，其他模块也跟着变化了，不行啊！！！
                        let string = JSON.stringify(this.model.data)
                        let object = JSON.parse(string)
                        window.eventHub.trigger('create', object)  
                    }
                )
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
        }
    }

    controller.init.call(controller, view, model)
}