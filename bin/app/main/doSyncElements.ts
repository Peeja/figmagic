import { Config } from '../contracts/config/Config';
import { FigmaData } from '../../domain/FigmaData/FigmaData';

import { createFolder } from '../../functions/filesystem/createFolder';
import { createPage } from '../../functions/process/createPage';
import { processElements } from '../../functions/process/processElements';
import { writeElements } from '../../functions/filesystem/writeElements';

import { msgSyncElements } from '../../frameworks/messages/messages';

/**
 * @description TODO
 *
 * @param config
 * @param data
 * @param outputFolder
 */
export async function doSyncElements(
  config: Config,
  data: FigmaData,
  outputFolder: string
): Promise<void> {
  console.log(msgSyncElements);

  try {
    const { components } = data;
    const elementsPage = createPage(data.document.children, 'Elements');
    const elements = await processElements(elementsPage, config, components);
    await createFolder(outputFolder);
    await writeElements(elements, config);
  } catch (error) {
    throw new Error(error);
  }
}
