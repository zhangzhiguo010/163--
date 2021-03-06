{
    let view = {
        el: '#songList-containner',
        template: `
            <ul class='songList'></ul>
        `,
        render(data){
            let {songs, selectSongId} = data
            let liList = songs.map((item)=>{
                let li = document.createElement('li')
                let a = document.createElement('a')
                a.innerText = item.name
                li.appendChild(a)
                li.setAttribute('data-song-id', item.id)
                if(item.id === selectSongId){$(li).addClass('active')}
                return li
            })
            document.querySelector(this.el).innerHTML = this.template
            liList.map((item)=>{
                document.querySelector('.songList').appendChild(item)
            })
        },
        clearActive(){
            if(document.querySelector('li[class="active"]')){
                document.querySelector('li[class="active"]').classList.remove('active')
            }
        }
    }
    let model = {
        data: {
            songs: [],
            selectSongId: undefined //被选中的元素记录在这里，render的时候寻找该信息添加样式
        },
        fetch(){
            let query = new AV.Query('Song')
            return query.find().then((songs)=>{
                songs.map((song)=>{
                    let songItem = Object.assign({}, {'id':song.id}, song.attributes)
                    this.data.songs.push(songItem)
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
                let currentSongId = ev.currentTarget.getAttribute('data-song-id')
                this.model.data.selectSongId = currentSongId
                this.view.render(this.model.data)

                // this.view.activeItem(ev.currentTarget)
                let currentSong
                this.model.data.songs.map((item)=>{
                    if(currentSongId === item.id){
                        currentSong = item
                    }
                })
                window.eventHub.trigger('select', JSON.parse(JSON.stringify(currentSong)))
            })
        },
        bindEventHubs(){
            // 监听到事件后做2件事：更新model中数据、更新页面
            // 创建新的li和a，将ul添加到页面，循环将li添加到ul
            window.eventHub.listen('create', (data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            window.eventHub.listen('new', ()=>{
                this.view.clearActive()

            })
            window.eventHub.listen('update', (data)=>{
                // this.model.data.selectSongId = data.id
                this.model.data.songs.map((song)=>{
                    if(song.id === data.id){
                        Object.assign(song, data)
                    }
                })
                this.view.render(this.model.data)
            })
        }
    }

    controller.init.call(controller, view, model)
}