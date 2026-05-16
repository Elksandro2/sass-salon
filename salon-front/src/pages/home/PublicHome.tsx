import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Sparkles, CalendarHeart, Scissors } from 'lucide-react';
import './PublicHome.css';

export const PublicHome = () => {
  return (
    <div className="public-home">
      <Container className="public-home-inner">
        <section className="home-hero fade-in-up text-center">
          <p className="home-eyebrow mb-2">Salão Cristiane</p>
          <h1 className="home-title">Beleza e bem-estar no seu ritmo</h1>
          <p className="home-lead mx-auto">
            Conheça nossos serviços e reserve um horário com quem mais entende do seu estilo.
          </p>
          <div className="home-cta d-flex flex-wrap justify-content-center gap-3 mt-4">
            <Link to="/appointment" className="btn btn-primary btn-lg home-btn-primary">
              <CalendarHeart size={20} className="me-2" aria-hidden />
              Agendar agora
            </Link>
            <Link to="/services" className="btn btn-outline-primary btn-lg home-btn-outline">
              <Scissors size={20} className="me-2" aria-hidden />
              Ver serviços
            </Link>
          </div>
        </section>

        <Row className="g-4 mt-2 mt-md-4 justify-content-center home-features fade-in-up">
          <Col sm={6} lg={4}>
            <div className="home-feature-card h-100">
              <Sparkles className="home-feature-icon" size={28} aria-hidden />
              <h3 className="home-feature-title">Atendimento cuidadoso</h3>
              <p className="home-feature-text mb-0">
                Equipe dedicada para destacar o melhor em você.
              </p>
            </div>
          </Col>
          <Col sm={6} lg={4}>
            <div className="home-feature-card h-100">
              <CalendarHeart className="home-feature-icon" size={28} aria-hidden />
              <h3 className="home-feature-title">Agendamento online</h3>
              <p className="home-feature-text mb-0">
                Escolha serviço, profissional e horário em poucos passos.
              </p>
            </div>
          </Col>
          <Col sm={6} lg={4}>
            <div className="home-feature-card h-100">
              <Scissors className="home-feature-icon" size={28} aria-hidden />
              <h3 className="home-feature-title">Serviços variados</h3>
              <p className="home-feature-text mb-0">
                Tratamentos pensados para realçar sua beleza natural.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
