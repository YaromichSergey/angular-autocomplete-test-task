import { NgModule } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { AutocompleteDirective } from './directives/autocomplete.directive';
import { AutocompleteContentDirective } from './directives/autocomplete-content.directive';
import { OptionComponent } from './components/option/option.component';

@NgModule({
  declarations: [
    AutocompleteComponent,
    AutocompleteDirective,
    AutocompleteContentDirective,
    OptionComponent
  ],
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule
  ],
  exports: [
    AutocompleteComponent,
    AutocompleteDirective,
    AutocompleteContentDirective,
    OptionComponent
  ]
})
export class AutocompleteModule { }
