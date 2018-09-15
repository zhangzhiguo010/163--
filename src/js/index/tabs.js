{
    let view = {
        el: '#tabs',
        template: '',
        init(){},
        render(){}
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.init()
            this.el = document.querySelector(this.view.el)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents(){
            $(this.view.el).on('click', '.tabs-nav > li', (ev)=>{
                let $currentLi = $(ev.currentTarget)
                let pageName = ev.currentTarget.getAttribute('data-tab-name')
                $currentLi.addClass('active').siblings().removeClass('active')
                window.eventHub.trigger('select', pageName)
            })
        },
        bindEventHub(){

        }
    }

    controller.init(view, model)
}