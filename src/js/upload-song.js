{
    let view = {
        el:'#uploadArea',
        template: `
            <label class="draggable">
                <div class="clickable">
                    <input type="file" id="fileUpLoad" class="xxx">
                    <span>点击或拖曳文件</span>
                    <p>文件大小不能超过 40MB</p>
                    <p class='speed'></p>
                </div>
            </label>
        `,
        render(){
            document.querySelector(this.el).innerHTML = this.template
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render()
            this.getTokenAndBindEvents()
        },
        getTokenAndBindEvents(){
            this.ajaxFunction({
                method: 'POST',
                url: 'http://localhost:8888/uptoken',
                body: '',
                headers: ''
            }).then(
                (res)=>{
                    let token = JSON.parse(res).token
                    document.querySelector('#fileUpLoad').addEventListener('change', (ev)=>{this.initQiniu(ev, token)})
                }
            )
        },
        initQiniu(ev, token){
            let file = ev.currentTarget.files[0]
            let key = file.name
            let putExtra = {
                fname: "",
                params: {},
                mimeType: null
              };
            let config = {
              useCdnDomain: true,
              region: qiniu.region.z2
            };
            let observable = qiniu.upload(file, key, token, putExtra, config)
            observable.subscribe(this.upLoadCallBack())
        },
        upLoadCallBack(){
            // window.eventHub.trigger('beforeUpload')
            // 上传之前触发的事件，没找到API，不知在哪里添加
            return {
                next(res){
                    window.eventHub.trigger('beforeUpload')
                    let total = res.total;
                    document.querySelector('.speed').innerText = `速度：${total.percent}%`
                },
                error(err){
                    console.log(`错误：${err}`)
                },
                complete(res){
                    window.eventHub.trigger('afterUpload')

                    let domain = 'peo1lbeva.bkt.clouddn.com'
                    let key = encodeURIComponent(res.key) 
                    let sourceLink = `http://${domain}/${key}`      //外链
                    window.eventHub.trigger('new', {url: sourceLink, name: res.key})
                }
            }
        },
        ajaxFunction(objy){
            let {method, url, body, headers} = objy
            return new Promise( (resolve, reject) =>{
                let xhr = new XMLHttpRequest()
                xhr.open(method, url)
                xhr.onreadystatechange = ()=>{
                    if(xhr.readyState === 4){
                        if(xhr.status>=200 && xhr.status<300){
                            resolve.call(undefined,xhr.responseText)
                        }else if(xhr.status>=400){
                            reject.call(undefined, xhr)
                        }
                    }
                }
                for(let key in headers){
                    xhr.setRequestHeader(key,headers[key])
                }
                xhr.send(body)
            })
        }
    }

    controller.init.call(controller, view, model)
}