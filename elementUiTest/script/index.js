class Demo {
    constructor(name = 'awy') {
        this.name = name
    }
    static mo(e) {
        e.preventDefault()
	}
	bodyClassList(){
		return document.body.classList
	}
    stop() {
		document.addEventListener('touchmove', Demo.mo, false)
        document.getElementsByTagName('body')[0].className = 'add_stop'
	}
	move() {
		document.removeEventListener('touchmove', Demo.mo, false)
		document.body.removeAttribute('class', 'add_stop')
	}
    test() {
        // console.log(this.name)
    }
}
