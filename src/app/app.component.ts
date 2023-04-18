import {Component, OnInit} from '@angular/core';
import {OWGameListener, OWGames, OWGamesEvents, OWHotkeys, OWWindow} from "@overwolf/overwolf-api-ts";
import {kGamesFeatures, kHotkeys} from "./const";
import RunningGameInfo = overwolf.games.RunningGameInfo;
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _gameListener: OWGameListener;
  private _gameEventsListener: OWGamesEvents;
  private _desktop: OWWindow;
  private runningGameId$ = new BehaviorSubject<number>(0);
  private runningGameFeatures$ = new BehaviorSubject<string[]>([]);

  constructor(private readonly router: Router) {}

  ngOnInit() {
    console.log('ngOnInit');

    // prevents Error: NG04002
    this.router.navigateByUrl('');

    this._desktop = new OWWindow('desktop');
    const header = document.getElementById('header');
    if(header) {
      this.setDrag(header);
    }

    this.setToggleHotkeyBehavior();

    this.getRunningGameInfo()
      .then(() => this.run());
  }

  public run() {
    console.log('run');
    this._gameListener = new OWGameListener({
      onGameStarted: this.onStart.bind(this),
      onGameEnded: this.onStop.bind(this)
    });
    this._gameListener.start();
    console.log('started gameListener');

    this._gameEventsListener = new OWGamesEvents(
      {
        onInfoUpdates: this.onInfoUpdates.bind(this),
        onNewEvents: this.onNewEvents.bind(this)
      },
      this.runningGameFeatures$.getValue()
    );
  }

  async getRunningGameInfo() {
    const info = await OWGames.getRunningGameInfo();
    this.runningGameId$.next(await this.getCurrentGameClassId(info) || 0);
    this.runningGameFeatures$.next(kGamesFeatures.get(this.runningGameId$.getValue()) || []);
  }

  async onStart(info: RunningGameInfo) {
    await this._gameEventsListener.start();
    console.log('start event listener', info);
  }

  async onStop(info: RunningGameInfo) {
    this._gameEventsListener.stop();
    console.log('stopped event listener', info);
  }

  close() {
    this._desktop.close();
  }

  private onInfoUpdates(info: any) {
    return;
  }

  private async onNewEvents(e: any) {
    return;
  }

  private async getCurrentGameClassId(info: RunningGameInfo): Promise<number | null> {
    return (info && info.isRunning && info.classId) ? info.classId : null;
  }

  private async setDrag(elem: HTMLElement) {
    this._desktop.dragMove(elem);
  }

  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = (
      hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
    ):void => {}

    OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow);
  }
}
