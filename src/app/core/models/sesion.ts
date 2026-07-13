/** Payload de sesión que devuelve POST /auth/login. */
export interface Sesion {
  token: string;
  id_usuario: number;
  username: string;
  s_nombre_completo: string;
  id_empleado: number;
  s_foto_empleado: string | null;
  id_tipo_usuario: number;
  id_tipo_empleado: number | null;
  s_tipo_empleado: string;
  id_sucursal: number | null;
}
