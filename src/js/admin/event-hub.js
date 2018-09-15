window.eventHub = {
    // 内容：{click: [fn1, fn2], dbclick: [fn3, fn4]}
    events: {},      
    listen(eventName, fn){
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    },
    trigger(eventName, data){
        for(let key in this.events){
            if(key === eventName){
                this.events[key].map((item)=>{
                    item.call(undefined, data)
                })
            }
        }
    }
}
