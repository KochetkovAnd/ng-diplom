import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';
import { asapScheduler, asyncScheduler } from 'rxjs';
import { Block } from '../models/block';
import { trigger, state, style, transition, animate } from '@angular/animations';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
@Component({
    selector: 'app-drop-list-group',
    templateUrl: './drop-list-group.component.html',
    styleUrls: ['./drop-list-group.component.css'],
    animations: [
        trigger('move', [
            state('*',
                style(
                    {
                        marginLeft: '{{horizontalMargin}}%',
                        marginTop: '{{verticalMargin}}%',
                    }
                ),
                {
                    params: {
                        horizontalMargin: 0,
                        verticalMargin: 0
                    }
                }
            ),
            transition("*=>*", animate('0.3s'))
        ]),
        trigger('rotate', [
            state('*',
                style(
                    {
                        transform: 'rotate({{angle}}deg)'
                    }
                ),
                {
                    params: {
                        angle: 0
                    }
                }
            ),
            transition("*=>*", animate('0.3s'))
        ])
    ]
})
export class DropListGroupComponent {

    commands: Block[] = [
        { "type": "simple", "text": "Шаг вперед", color: "rgb(83, 94, 245)", include: [] },
        { "type": "simple", "text": "Поворот налево", color: "rgb(83, 94, 245)", include: [] },
        { "type": "simple", "text": "Поворот направо", color: "rgb(83, 94, 245)", include: [] },
        { "type": "composite", "text": "Повторить", color: "rgb(226, 103, 31)", include: [] },
    ]

    program:Block[] =[]

    @ViewChildren(CdkDropList)
    private dlq?: QueryList<CdkDropList>;

    public dls: CdkDropList[] = [];

    n = 6; m = 8; 
    max = 0; cellSize = 0;
    state = 0; horizontalMargin = 0; verticalMargin = 0; angle = 0;

    data: string[] = [] // TO DO

    ngOnInit(): void {
        this.max = this.n > this.m ? this.n : this.m;
        this.cellSize = 100 / this.max

        for (let i = 0; i < this.n * this.m; i++) {
            this.data.push(i.toString())
        }
        console.log(this.data)
    }    

    ngAfterViewChecked() {
        let ldls: CdkDropList[] = [];

        if (this.dlq) {
            this.dlq.forEach((dl) => {
                ldls.push(dl)
            });
        }
        ldls = ldls.reverse()

        if (ldls.length != this.dls.length) {
            asapScheduler.schedule(() => { this.dls = ldls; });
        } else {
            let same = true
            for (let i = 0; i < ldls.length; i++) {
                same = same && ldls[i] === this.dls[i]
            }
            if (!same) {
                asapScheduler.schedule(() => { this.dls = ldls; });
            }
        }
    }

    cloneBlock(block: Block):Block {
        return {
            type: block.type,
            text: block.text,
            color: block.color,
            include: []
        }
    }

    drop(event: CdkDragDrop<Block[]>) {
        if (event.previousContainer.id == "from") {

            let copy = this.cloneBlock(event.previousContainer.data[event.previousIndex])
            event.container.data.splice(event.currentIndex, 0, copy)

        
        } else if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    delete(event: CdkDragDrop<Block[]>) {
        if (event.previousContainer !== event.container) {
            event.previousContainer.data.splice(event.previousIndex, 1)
        }
    }

    async runProgram(commands: Block[]) {
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].type == "simple") {
                switch (commands[i].text) {
                    case "Шаг вперед":
                        this.stepForward()
                        await sleep(300)
                        break;
                    case "Поворот налево":
                        this.rotateLeft()
                        await sleep(300)
                        break;
                    case "Поворот направо":
                        this.rotateRight()
                        await sleep(300)
                        break;
                }
            } else {
                switch (commands[i].text) {
                    case "Повторить":
                        for (let j = 0; j < 2; j++) {
                            await this.runProgram(commands[i].include)
                        }
                        break;
                }
            }
        }
    }

    rotateRight(): void { this.angle += 90 }

    rotateLeft(): void { 
        this.angle -= 90
    }

    stepForward(): void {
        if (this.angle % 360 == 0) {
            this.verticalMargin -= this.cellSize;
        } else if (this.angle % 360 == 90) {
            this.horizontalMargin += this.cellSize;
        } else if (this.angle % 360 == 180) {
            this.verticalMargin += this.cellSize;
        } else {
            this.horizontalMargin -= this.cellSize;
        }
        this.state = this.horizontalMargin + this.verticalMargin;
    }

}
