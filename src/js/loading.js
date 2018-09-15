{
    let view = {
        el: '#site-loading',
        show(){
            document.querySelector(this.el).classList.add('active')
        },
        hide(){
            document.querySelector(this.el).classList.remove('active')
        }
    }
    let controller = {
        init(view){
            this.view = view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.listen('beforeUpload', ()=>{
                this.view.show()
            })
            window.eventHub.listen('afterUpload', ()=>{
                this.view.hide()
            })
        }
    }

    controller.init(view)
}