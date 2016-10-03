import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: 'build/components/gen-popover/gen-popover.html'
})

export class GenPopover {
    private dataArray: string[];
    private viewCtrl: ViewController;
    private params: NavParams;

    constructor(
        _viewCtrl: ViewController,
        _params: NavParams
    ) {
        this.viewCtrl = _viewCtrl;
        this.params = _params;
        this.dataArray = this.params.get('dataArray');
    }

    //Close popover and send option string as a NavParam
    close(option: string) {
        console.log('closing gen pop');
        this.viewCtrl.dismiss({
            option: option
        });
    }
}