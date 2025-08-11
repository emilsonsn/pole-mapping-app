import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  options: AnimationOptions = {
    path: '/assets/animation/Animation - 1732981560314.json',
  };

  itemPublic: { icon: string, title: string, description: string }[] = [
    {
      icon: "assets/images/image1.svg",
      title: "Orientação individual",
      description: "Receba conselhos personalizados dos nossos consultores especialistas, adaptados ao seu mapa astrológico."
    },
    {
      icon: "assets/images/image2.svg",
      title: "Leitura astrológica personalizada",
      description: "Obtenha uma leitura detalhada que destaca o seu perfil astrológico e a sua influência na sua vida e relações."
    },
    {
      icon: "assets/images/image3.svg",
      title: "Compreensão mais profunda de si mesmo",
      description: "Explore as profundezas da sua personalidade, forças, fraquezas e tendências inatas para promover crescimento pessoal e desenvolvimento."
    },
    {
      icon: "assets/images/image4.svg",
      title: "Padrões de relacionamento reveladores",
      description: "Descubra os padrões que regem os seus relacionamentos e desvende as subtilezas das suas necessidades emocionais e sexuais."
    },
  ];
  itemBenefiting: { title: string, description: string }[] = [
    {
      title: "200 mil",
      description: "utilizadores satisfeitos"
    },
    {
      title: "94% de precisão",
      description: "avaliado por utilizadores reais"
    },
    {
      title: "4.8/5 estrelas",
      description: "pontuação de satisfação"
    },
    {
      title: "80+ consultores",
      description: "rigorosamente testados"
    },
  ];

  itemComment: { username: string, date: Date, comment: string, rating: number }[] = [
    {
      username: "beatrizvieira_oficial",
      date: new Date(),
      comment: "O Zodarium me ajudou a entender melhor o meu relacionamento e a minha personalidade. Recomendo muito!",
      rating: 5
    },
    {
      username: "ana_martins85",
      date: new Date(),
      comment: "A aplicação é excelente e tem sido extremamente útil. Estou muito satisfeita com a experiência e recomendo a todos.",
      rating: 4
    },
    {
      username: "_sandrasouzza",
      date: new Date(),
      comment: "Fantástico! Nunca pensei que fosse aprender tanto sobre mim mesmo. Merece cinco estrelas!",
      rating: 5
    },
    {
      username: "mariana_pv",
      date: new Date(),
      comment: "Funciona! O relatório acertou tudo que aconteceu comigo! Até as coisas ruins...",
      rating: 4
    }
  ];

  constructor(private router: Router){}

  navigateToQuiz(rota, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => {      
      this.router.navigate([`${rota}`]);
    }, 100); 
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


}
