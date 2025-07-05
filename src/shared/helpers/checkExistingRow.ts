import { NotFoundException } from '../error-handling/exceptions/not-found.exception'

type ModelDelegate = {
  findUnique: (args: { where: { id: number } }) => Promise<any>
}

export const checkExists = async (
  model: ModelDelegate,
  id: number,
  entityName: string
): Promise<void> => {
  const result = await model.findUnique({
    where: { id }
  })
  if (!result) {
    throw new NotFoundException(`${entityName} dengan id ${id} tidak ditemukan`)
  }
}
