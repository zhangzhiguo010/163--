{
    let view = {
        el: '#page-1',
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
            this.loadModule1()
            this.loadModule2()
        },
        bindEvents(){},
        bindEventHub(){
            window.eventHub.listen('select', (tabName)=>{
                if(tabName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })   
        },
        loadModule1(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js'    //相对于html文件的地址
            document.body.appendChild(script1)
            // script1.onload = ()=>{console.log('模块1加载完毕')}
        },
        loadModule2(){
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js'    //相对于html文件的地址
            document.body.appendChild(script2)
            // script2.onload = ()=>{console.log('模块2加载完毕')}
        }
    }

    controller.init(view, model)
}