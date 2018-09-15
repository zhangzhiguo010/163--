{
    let view = {
        el: '#page-2',
        show(){
            document.querySelector(this.el).classList.add('active')
        },
        hide(){
            document.querySelector(this.el).classList.remove('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents(){},
        bindEventHub(){
            window.eventHub.listen('select', (tabName)=>{
                if(tabName === 'page-2'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })   
        }
    }

    controller.init(view, model)
}