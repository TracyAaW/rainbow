import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColorCardComponent } from './shared/components/color-card/color-card.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ColorService } from './core/services/data/color.service';
import { Observable } from 'rxjs';
import { NamedColor } from './shared/data/named-color.model';
import { animate, style, transition, trigger } from '@angular/animations';

const SHOW_GRAYSCALE_KEY = 'showGrayscale';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ColorCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeAnimation', [ 
      transition('* => *', [
        style({ opacity: 0 }), 
        animate(500, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'rainbow';
  showGrayscaleSetting = false;

  private colorService: ColorService = inject(ColorService);
  private document: Document = inject(DOCUMENT);
  private renderer: Renderer2 = inject(Renderer2);

  filteredColors$: Observable<NamedColor[]> = this.colorService.filteredColors$;

  ngOnInit(): void {
    this.showGrayscaleSetting = !!localStorage.getItem(SHOW_GRAYSCALE_KEY);
    if (this.showGrayscaleSetting) {
      this.renderer.addClass(this.document.body, 'bkg-grayscale');
    }
    this.renderer.addClass(this.document.body, 'bkg-dark');
  }

  changeFilter(evt: any) {
    const filterText: string = (evt.target.value as string).trim();
    this.colorService.changeFilterText(filterText);
  }

  changeGrayscale(evt: any) {
    const showInGray = evt.target.checked;
    showInGray ? this.makeGrayscale() : this.makeColorized();
  }

  makeGrayscale() {
    localStorage.setItem(SHOW_GRAYSCALE_KEY, 'true');
    this.renderer.addClass(this.document.body, 'bkg-grayscale');
  }

  makeColorized() {
    localStorage.removeItem(SHOW_GRAYSCALE_KEY);
    this.renderer.removeClass(this.document.body, 'bkg-grayscale');
  }

}
