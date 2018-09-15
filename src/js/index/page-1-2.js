{
    let view = {
        el: '#page-1 > .songs',
        template: `
            <h3>{name}</h3>
            <p>{singer}</p>
            <a class="playButton" href="./song.html?id={id}"></a>
        `,
        render(data){
            let {songs} = data
            let placeholder = ['name', 'singer', 'id']
            songs.map((song)=>{
                let newTemplate = this.template
                placeholder.map((item)=>{
                    newTemplate = newTemplate.replace(`{${item}}`, song[`${item}`])
                })
                let li = document.createElement('li')
                li.innerHTML = newTemplate
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