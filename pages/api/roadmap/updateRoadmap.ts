import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose, { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import Roadmap, { IRoadmap, INode, IEdge, IContent } from '@/models/Roadmap';
import dbConnect from '@/lib/mongodb';

interface JwtPayload {
  userId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { method, headers, body, query } = req;

  // Middleware para verificar o token de autenticação
  const authenticate = (): string | null => {
    const authHeader = headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded.userId;
    } catch {
      return null;
    }
  };

  const userId = authenticate();

  if (!userId) {
    return res.status(401).json({ message: 'Token de autenticação inválido ou expirado.' });
  }

  if (method !== 'PUT') {
    return res.setHeader('Allow', ['PUT']).status(405).end(`Método ${method} não permitido.`);
  }

  try {
    const { id } = query;
    const {
      newName,
      newNameSlug,
      nodesToRename,
      nodesToDelete,
      nodesToAdd,
      edgesToDelete,
      edgesToAdd,
      contentsToUpdate,
      contentsToDelete,
      contentsToAdd,
    } = body;

    // Buscar o roadmap existente
    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap não encontrado.' });
    }

    // Renomear roadmap e nameSlug
    if (newName) roadmap.name = newName;
    if (newNameSlug) roadmap.nameSlug = newNameSlug;

    // Renomear nós existentes
    if (nodesToRename && Array.isArray(nodesToRename)) {
      nodesToRename.forEach((nodeUpdate: { nodeId: string; newName: string }) => {
        const node = roadmap.nodes.find((n: INode) => n._id.toString() === nodeUpdate.nodeId);
        if (node) {
          node.name = nodeUpdate.newName;
        }
      });
    }

    // Apagar nós
    if (nodesToDelete && Array.isArray(nodesToDelete)) {
      roadmap.nodes = roadmap.nodes.filter(
        (node: INode) => !nodesToDelete.includes(node._id.toString())
      );

      // Também remover conexões associadas aos nós deletados
      roadmap.edges = roadmap.edges.filter(
        (edge: IEdge) =>
          !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
      );
    }

    // Adicionar novos nós
    if (nodesToAdd && Array.isArray(nodesToAdd)) {
      nodesToAdd.forEach((node: Partial<INode>) => {
        roadmap.nodes.push({
          _id: new Types.ObjectId(),
          name: node.name || '',
          description: node.description || '',
          contents: node.contents || [],
          position: node.position || { x: 0, y: 0 },
        });
      });
    }

    // Apagar conexões
    if (edgesToDelete && Array.isArray(edgesToDelete)) {
      roadmap.edges = roadmap.edges.filter(
        (edge: IEdge) =>
          !edgesToDelete.some(
            (delEdge: IEdge) => delEdge.source === edge.source && delEdge.target === edge.target
          )
      );
    }

    // Adicionar conexões
    if (edgesToAdd && Array.isArray(edgesToAdd)) {
      edgesToAdd.forEach((edge: IEdge) => {
        roadmap.edges.push(edge);
      });
    }

    // Editar conteúdos dos nós
    if (contentsToUpdate && Array.isArray(contentsToUpdate)) {
      contentsToUpdate.forEach((contentUpdate: { nodeId: string; contentId: string; newType: string; newUrl: string }) => {
        const node = roadmap.nodes.find((n: INode) => n._id.toString() === contentUpdate.nodeId);
        if (node) {
          const content = node.contents.find((c: IContent) => c._id.toString() === contentUpdate.contentId);
          if (content) {
            if (contentUpdate.newType === 'vídeo' || contentUpdate.newType === 'website') {
              content.type = contentUpdate.newType;
            }
            content.url = contentUpdate.newUrl;
          }
        }
      });
    }

    // Apagar conteúdos dos nós
    if (contentsToDelete && Array.isArray(contentsToDelete)) {
      contentsToDelete.forEach((contentDelete: { nodeId: string; contentId: string }) => {
        const node = roadmap.nodes.find((n: INode) => n._id.toString() === contentDelete.nodeId);
        if (node) {
          node.contents = node.contents.filter(
            (content: IContent) => content._id.toString() !== contentDelete.contentId
          );
        }
      });
    }

    // Adicionar novos conteúdos aos nós
    if (contentsToAdd && Array.isArray(contentsToAdd)) {
      contentsToAdd.forEach((contentAdd: { nodeId: string; content: IContent }) => {
        const node = roadmap.nodes.find((n: INode) => n._id.toString() === contentAdd.nodeId);
        if (node) {
          node.contents.push({
            _id: new Types.ObjectId(),
            type: contentAdd.content.type,
            title: contentAdd.content.title,
            url: contentAdd.content.url,
          });
        }
      });
    }

    // Salvar as alterações no roadmap
    await roadmap.save();

    res.status(200).json({ message: 'Roadmap atualizado com sucesso.', roadmap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o roadmap.' });
  }
}
