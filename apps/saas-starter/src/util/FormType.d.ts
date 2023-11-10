export type FormType = |
{ type: 'initial' } |
{ type: 'error', message: string } |
{ type: 'success', [key: string]: string }