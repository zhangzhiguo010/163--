{
    let view = {
        el: '#songList-containner',
        template: `
            <ul class='songList'></ul>
        `,
        render(data){
            let {songs} = data
            let liList = songs.map((item)=>{
                let li = document.createElement('li')
                let a = document.createElement('a')
                a.innerText = item.name
                li.appendChild(a)
                return li
            })
            document.querySelector(this.el).innerHTML = this.template
            liList.map((item)=>{
                document.querySelector('.songList').appendChild(item)
            })
        },
        activeItem($li){
            console.log($li)
            $li.addClass('active').siblings('.active').removeClass('active')
        },
        clearActive(){
            if(document.querySelector('li[class="active"]')){
                document.querySelector('li[class="active"]').classList.remove('active')
            }
        }
    }
    let model = {
        data: {
            songs: []
        },
        fetch(){
            let query = new AV.Query('Song')
            return query.find().then((songs)=>{
                songs.map((song)=>{
                    let songItem = Object.assign({}, {'id':song.id}, song.attributes)
                    this.data.songs.unshift(songItem)
                })
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getAllSongs()
            this.bindEvents()
            this.bindEventHubs()
        },
        getAllSongs(){
            this.model.fetch().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click', 'li', (ev)=>{
                let $currentLi = $(ev.currentTarget)
                this.view.activeItem($currentLi)
            })
        },
        bindEventHubs(){
            window.eventHub.listen('upload', (data)=>{
                this.view.clearActive()
            })
            // 监听到事件后做2件事：更新model中数据、更新页面
            // 创建新的li和a，将ul添加到页面，循环将li添加到ul
            window.eventHub.listen('create', (data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }

    controller.init.call(controller, view, model)
}