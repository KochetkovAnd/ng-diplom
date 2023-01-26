import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';
import { asapScheduler, asyncScheduler } from 'rxjs';
import { Block } from '../models/block';
import { trigger, state, style, transition, animate, useAnimation, keyframes } from '@angular/animations';


const sleepTime = 300;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const cloneBlock = (block: Block) => {
    return {
        type: block.type,
        text: block.text,
        color: block.color,
        include: []
    }
}

@Component({
    selector: 'app-drop-list-group',
    templateUrl: './drop-list-group.component.html',
    styleUrls: ['./drop-list-group.component.css'],
    animations: [
        trigger('move', [
            state('*',
                style(
                    {
                        marginLeft: '{{x}}%',
                        marginTop: '{{y}}%',
                    }
                ),
                {
                    params: {
                        x: 0,
                        y: 0,
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
        ]),
        trigger('shake', [            
            transition("*=>*",[
                animate('1s', keyframes([
                    style({background: "rgba(211, 15, 15, 0.5)"}),
                    style({background: "rgba(211, 15, 15, 0)"}),
                    style({background: "rgba(211, 15, 15, 0.5)"}),
                    style({background: "rgba(211, 15, 15, 0)"})
                ]))
            ])
            
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

    program: Block[] = []

    @ViewChildren(CdkDropList)
    private dlq?: QueryList<CdkDropList>;

    public dls: CdkDropList[] = [];

    n = 5; m = 4;
    max = 0; cellSize = 0;

    x = 0; y = 0;
    xy = 0; angle = 0;

    shake = false;

    cells = Array.from("11111111111111111111")

    ngOnInit(): void {
        this.max = this.n > this.m ? this.n : this.m;
        this.cellSize = 100 / this.max
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



    drop(event: CdkDragDrop<Block[]>) {
        if (event.previousContainer.id == "from") {

            let copy = cloneBlock(event.previousContainer.data[event.previousIndex])
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
                if (commands[i].text == "Шаг вперед") {
                    if (this.canTakeStep()) {
                        this.stepForward()
                        await sleep(sleepTime)
                    } else {
                        console.log("fgfg")
                        this.shake = !this.shake                        
                        break;
                    }
                } else if (commands[i].text == "Поворот налево") {
                    this.rotateLeft()
                    await sleep(sleepTime)
                } else if (commands[i].text == "Поворот направо") {
                    this.rotateRight()
                    await sleep(sleepTime)
                }
            } else {
                if (commands[i].text == "Повторить") {
                    for (let j = 0; j < 2; j++) {
                        await this.runProgram(commands[i].include)
                    }
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
            this.y -=1
        } else if (this.angle % 360 == 90 || this.angle % 360 == -270) {
            this.x +=1
        } else if (this.angle % 360 == 180 || this.angle % 360 == -180) {
            this.y +=1
        } else {
            this.x -=1
        }
        this.xy =this.x + this.y
    }

    canTakeStep(): boolean {
        console.log(this.angle)
        console.log(this.angle % 360)
        if (this.angle % 360 == 0) {
            return !(this.y - 1 < 0 || this.cells[(this.y - 1) * this.m + this.x] == "0")
        } else if (this.angle % 360 == 90 || this.angle % 360 == -270) {
            return !(this.x + 1 >= this.m || this.cells[this.y * this.m + this.x + 1] == "0")
        } else if (this.angle % 360 == 180 || this.angle % 360 == -180) {
            return !(this.y + 1 >= this.n || this.cells[(this.y + 1) * this.m + this.x] == "0")
        } else {
            return !(this.x - 1 < 0 || this.cells[this.y * this.m + this.x - 1] == "0")
        }
    }
}
