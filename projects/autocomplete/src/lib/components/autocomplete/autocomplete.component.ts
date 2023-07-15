import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';

import { AutocompleteContentDirective } from '../../directives/autocomplete-content.directive';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'lib-autocomplete',
  templateUrl: './autocomplete.component.html',
  exportAs: 'libAutocomplete',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {

  @ViewChild('root')
  rootTemplate!: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective)
  content!: AutocompleteContentDirective;

  @ContentChildren(OptionComponent)
  options!: QueryList<OptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map((option: { click$: any; }) => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
