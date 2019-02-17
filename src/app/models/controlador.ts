export class controlador {
    private cont: number = 0;
    private ordens: Array<String>;
    private status: Boolean = true;
    constructor(ordens: Array<String> = []) {
        this.ordens = ordens
    }
    public see_cont(): Number {
        return this.cont;
    }
    public add_orden(nova_ordem: String): Boolean {
        if (nova_ordem == '+1' || nova_ordem == '-1') {
            this.ordens.push(nova_ordem)
            return true
        } else {
            return false
        }
    }
    public async executa_ordens() {
        while (this.ordens.length) {
            let ordem: String = this.ordens.shift()
            if (ordem == '+1') {
                this.cont += 1;
            } else if (ordem == '-1') {
                this.cont -= 1;
            }
        }
        setInterval(this.executa_ordens, 1000)
    }
}