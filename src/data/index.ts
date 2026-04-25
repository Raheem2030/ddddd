import { Subject, SubjectContent } from '../types';

import { physical_chemistry_1 } from './year2/theoretical/physical_chemistry_1';
import { pharmaceutics_1 } from './year2/theoretical/pharmaceutics_1';
import { analytical_chemistry_1 } from './year2/practical/analytical_chemistry_1';
import { pharmaceutics_2 } from './year2/practical/pharmaceutics_2';
import { biochemistry_1 } from './year2/practical/biochemistry_1';
import { subjects } from './subjects';

export { subjects };

export const subjectContents: Record<string, SubjectContent> = {
  '2-1-4': physical_chemistry_1,
  '2-1-6': pharmaceutics_1,
  '2-2-1': analytical_chemistry_1,
  '2-2-2': pharmaceutics_2,
  '2-2-5': biochemistry_1,
};
