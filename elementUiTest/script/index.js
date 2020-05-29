class Control {
    static mo(e) {
        e.preventDefault()
	}
	bodyClassList(){
		return document.body.classList
	}
    stop() {
		document.addEventListener('touchmove', Control.mo, false)
        document.getElementsByTagName('body')[0].className = 'add_stop'
	}
	move() {
		document.removeEventListener('touchmove', Control.mo, false)
		document.body.removeAttribute('class', 'add_stop')
	}

}
