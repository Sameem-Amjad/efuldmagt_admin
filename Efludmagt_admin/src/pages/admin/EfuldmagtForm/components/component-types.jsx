import { Type, AlignLeft, Calendar, Radio, CheckSquare, Heading3 } from 'lucide-react'

export const componentTypes = [
  {
    id: 'headline',
    type: 'headline',
    label: 'Headline',
    icon: Type,
  },
  {
    id: 'note',
    type: 'note',
    label: 'Note',
    icon: AlignLeft,
  },
  {
    id: 'textField',
    type: 'textField',
    label: 'TextField',
    icon: Type,
  },
  {
    id: 'textarea',
    type: 'textArea',
    label: 'Text Area',
    icon: AlignLeft,
  },
  {
    id: 'datetime',
    type: 'date',
    label: 'Date and Time',
    icon: Calendar,
  },
  {
    id: 'single-answer',
    type: 'radioButtons',
    label: 'Question with one answer',
    icon: Radio,
  },
  {
    id: 'multiple-answer',
    type: 'checkBoxes',
    label: 'Question with multiple answers',
    icon: CheckSquare,
  },
]

