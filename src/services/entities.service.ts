import HttpClient from "../api/httpClient";
import { ItemsComboBaseDTO } from "../interfaces/ItemsComboBaseDTO";


class EntityService {
  static async search(search: string, controller = new AbortController()): Promise<ItemsComboBaseDTO[]> {
    const response = await HttpClient.get<ItemsComboBaseDTO[]>(`/entities/combo?search=${search}`,{controller: controller.signal});
    return response;
  }
}

export default EntityService;