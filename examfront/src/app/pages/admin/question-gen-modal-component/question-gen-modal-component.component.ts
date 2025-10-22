import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionGenerationRequest } from 'src/app/model/QuestionGenerationRequest';

@Component({
  selector: 'app-question-gen-modal-component',
  templateUrl: './question-gen-modal-component.component.html',
  styleUrls: ['./question-gen-modal-component.component.css']
})
export class QuestionGenModalComponentComponent {

  constructor(
    public dialogRef: MatDialogRef<QuestionGenModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionGenerationRequest
  ) {}

  submit(form: any) {
    if (form.valid) {
      this.dialogRef.close(this.data);
    }
  }
}
