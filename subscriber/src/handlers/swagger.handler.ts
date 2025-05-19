import fs from 'fs';

/**
 * @description: 处理 Swagger 文档
 * @param {any} data - Swagger 文档数据
 * @return {void}
 */
export function handleSwaggerDoc(data: any): void {
  try {
    let { basePath, paths } = data;
    paths = JSON.parse(paths)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `docs/swagger-doc-${timestamp}.json`;

    // 创建 docs 目录（如果不存在）
    if (!fs.existsSync('docs')) {
      fs.mkdirSync('docs');
    }

    // 保存文档
    fs.writeFileSync(fileName, JSON.stringify({ basePath, paths }, null, 2));
    console.log(`\nSwagger 文档已保存到: ${fileName}\n`);
  } catch (error) {
    console.error('保存 Swagger 文档失败:', error);
  }
}
