{
    let view = {
        el: '#page-1 > .songs',
        render(data){
            let {songs} = data
            songs.map((song)=>{
                let templateLi = `
                    <h3>${song.name}</h3>
                    <p>${song.singer}</p>
                    <a></a>
                `
                let li = document.createElement('li')
                li.innerHTML = templateLi
                document.querySelector(`${this.el} ol.list`).appendChild(li)
            })
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
                    this.data.songs.push(songItem)
                })
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.model.fetch().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view, model)
}