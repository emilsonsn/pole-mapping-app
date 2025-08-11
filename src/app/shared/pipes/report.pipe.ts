import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'report'
})
export class ReportPipe implements PipeTransform {

  transform(report: string): string {
    switch (report) {
      case 'CAREER-REPORT':
        return 'Guia de Carreira Astrológica';
      case 'KARMA-LIFE-LESSONS':
        return 'Carma e Lições de Vida';
      case 'HEALTH-WELL-BEING-GUIDE':
        return 'Guia de Saúde e Bem-Estar';
      case 'FINANCIAL-REPORT':
        return 'Oportunidades e Desafios Financeiros';
      case 'FRIENDSHIP-SOCIAL-CONNECTIONS':
        return 'Amizade e Conexões Sociais';
      case 'FAMILY-ANCESTRAL-TIES':
        return 'Relatório de Laços Familiares e Ancestrais';
      case 'EDUCATION-LEARNING-PATHWAYS':
        return 'Educação e Caminhos de Aprendizagem';
      case 'TRAVEL-RELOCATION-OPPORTUNITIES':
        return 'Oportunidades de Viagem e Relocalização';
      case 'SPIRITUAL-GROWTH-AWAKENING':
        return 'Guia de Crescimento Espiritual e Despertar';
      case 'LIFE-PURPOSE-PASSION':
        return 'Exploração de Propósito e Paixão de Vida';
      case 'STRESS-COPING-MECHANISMS':
        return 'Estratégias para Gerir o Stress';
      case 'CREATIVITY-SELF-EXPRESSION':
        return 'Guia de Criatividade e Autoexpressão';
      case 'LIFE-TRANSITIONS-MILESTONES':
        return 'Transições e Marcos de Vida';
      case 'PERSONAL-GROWTH-CHALLENGES':
        return 'Crescimento Pessoal e Desafios';
      case 'DECISION-MAKING-CHOICES':
        return 'Guia de Tomada de Decisões';
      case 'EMPOWERMENT-CONFIDENCE-BOOSTERS':
        return 'Fortalecimento Pessoal e Impulsionadores de Confiança';
      case 'ENTREPRENEURSHIP-BUSINESS':
        return 'Guia de Empreendedorismo e Negócios';
      case 'DATING-MATING-RELATING':
        return 'Relacionamentos e Conexões';
      case 'DIGITAL-INFLUENCE':
        return 'Presença Digital e Influência nas Redes Sociais';
      case 'QUEEN-OF-HEARTS':
        return 'Rainha de Copas: Decifrando a Sua Vida Amorosa';
      case 'BOSS-LADY-S-BLUEPRINT':
        return 'Plano de Sucesso da Mulher de Negócios';
      case 'SCHOLARLY-SPIRITS':
        return 'Espíritos Académicos: Um Guia de Numerologia para Estudantes';
      case 'VIRAL-VISIONARY':
        return 'Visionária Viral: O Mapa Numerológico de uma Influenciadora';
      case 'THE-VISIONARY-S-NUMBERS':
        return 'Os Números da Visionária: Sucesso nos Negócios com um Toque Feminino';
      case 'THE-TECH-DIVA-S-CODE':
        return 'O Código da Diva Tecnológica: Numerologia para a Inovadora';
      case 'ROMANTIC-BEGINNINGS':
        return 'Inícios Românticos: Um Guia de Numerologia para o Amor';
      case 'TOGETHER-IN-HARMONY':
        return 'Juntos em Harmonia: Um Guia de Numerologia para o Amor Duradouro';
      case 'FROM-YES-TO-I-DO':
        return 'Do Sim ao Eu Aceito: Numerologia do Noivado';
      case 'PATH-TO-SELF-LOVE':
        return 'Caminho para o Amor-Próprio: Reinvenção Após uma Separação';
      case 'LONE-WOLFS-PATH':
        return 'Caminho do Lobo Solitário: Decifrando o Seu Destino Amoroso';
      case 'PROFESSIONAL-PROWESS':
        return 'Poder Profissional: Um Guia de Numerologia para o Sucesso';
      case 'CAMPUS-CONQUEROR':
        return 'Conquistador do Campus: O Estudo Numerológico do Académico';
      case 'DIGITAL-DOMINANCE':
        return 'Domínio Digital: Uma Abordagem Numerológica à Influência Online';
      case 'STARTUP-SUCCESS':
        return 'Sucesso na Startup: Guia de Numerologia para Jovens Empreendedores';
      case 'CODING-YOUR-FUTURE':
        return 'Codificando o Seu Futuro: A Bússola Numerológica do Inovador';
      case 'NEW-CONNECTION-CODE':
        return 'Novo Código de Conexão: Um Guia para Relacionamentos';
      case 'COMMITTED-CALCULATIONS':
        return 'Cálculos de Compromisso: Um Guia para o Amor Duradouro';
      case 'ENGAGEMENT-EQUATIONS':
        return 'Equações do Noivado: Um Guia de Compromisso Numerológico';
      case 'SOLO-SHIFT':
        return 'Mudança Solo: Um Guia de Numerologia para Solteiros';
      case 'SOLO-SOJOURN':
        return 'Jornada Solo: Um Guia de Numerologia para a Independência';
      default:
        return report;
    }
  }
}
