import { NotFoundException } from '../error-handling/exceptions/not-found.exception'

type ModelDelegate = {
  findUnique: (args: any) => Promise<any | null>
}

export const checkExists = async <T extends ModelDelegate>(
  model: T,
  id: Parameters<T['findUnique']>[0]['where']['id'],
  entityName: string
): Promise<void> => {
  const result = await model.findUnique({
    where: { id: id as any }
  })
  if (!result) {
    throw new NotFoundException(`${entityName} dengan id ${id} tidak ditemukan`)
  }
}
