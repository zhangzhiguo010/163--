{
    let view = {
        el: '#newSong',
        template: `
            <p>新建歌曲</p>
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
            this.bindEvents()
            this.active()
        },
        bindEvents(){
            document.querySelector(`${this.view.el} p`).addEventListener('click', ()=>{
                window.eventHub.trigger('new')
            })
        },
        bindEventHubs(){
            window.eventHub.listen('new', ()=>{
                this.active()
            })
            window.eventHub.listen('select', ()=>{
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