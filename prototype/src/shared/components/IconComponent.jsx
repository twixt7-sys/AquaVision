import * as Icons from 'lucide-react';

/** Dynamic lucide resolver  -  same technique as Theria. Circle fallback. */
export function IconComponent({ name, className, style, size = 24 }) {
  const IconElement = Icons[name] || Icons.Circle;
  return <IconElement className={className} style={style} size={size} />;
}

export default IconComponent;
