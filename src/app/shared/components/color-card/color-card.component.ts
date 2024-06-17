import { Component, Input } from '@angular/core';
import { NamedColor } from '../../data/named-color.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-color-card',
  templateUrl: './color-card.component.html',
  styleUrls: ['./color-card.component.scss']
})
export class ColorCardComponent {

  @Input()
  color!: NamedColor;

}
