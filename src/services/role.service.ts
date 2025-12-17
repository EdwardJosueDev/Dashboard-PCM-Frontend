import HttpClient from "../api/httpClient";
import { ItemsComboBaseDTO } from "../interfaces/ItemsComboBaseDTO";

class RoleService {
  static async fetchCombo(): Promise<ItemsComboBaseDTO[]> {
    const response = await HttpClient.get<ItemsComboBaseDTO[]>(`/roles/combo`);
    return response;
  }
}

export default RoleService;