import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (date: Date) =>
  date
    ? format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "-";
