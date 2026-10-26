import { useToastMessage } from '../../hooks/useToast';

export default function Toast() {
  const msg = useToastMessage();
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}
