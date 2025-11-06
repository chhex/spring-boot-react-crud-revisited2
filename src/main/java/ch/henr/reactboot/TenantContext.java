package ch.henr.reactboot;

// TenantContext.java
public final class TenantContext {
  private static final ThreadLocal<String> CUR = new ThreadLocal<>();
  public static void set(String t){ CUR.set(t); }
  public static String get(){ return CUR.get(); }
  public static void clear(){ CUR.remove(); }
  private TenantContext(){}
}
