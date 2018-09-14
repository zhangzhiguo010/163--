{
    let view = {
        el: '#newSong',
        template: `
            新建歌曲
        `,
        render(data){
            document.querySelector(this.el).innerHTML = this.template
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEventHubs()
            this.active()
        },
        bindEventHubs(){
            window.eventHub.listen('upload', (data)=>{
                this.active()
            })
            window.eventHub.listen('select', (data)=>{
                this.deactive()
            })
        },
        active(){
            document.querySelector(this.view.el).classList.add('active')
        },
        deactive(){
            document.querySelector(this.view.el).classList.remove('active')
        }
    }

    controller.init.call(controller, view, model)
}